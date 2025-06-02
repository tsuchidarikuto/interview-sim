// src/domain/interview/services/InterviewSchedulingService.ts

import { InterviewSession, InterviewStatus } from "@/domain/interview/entities/InterviewSession";
import { User } from "@/domain/user/entities/User";

// Assuming a repository or other way to check existing appointments
export interface AvailabilityChecker {
  isSlotAvailable(userId: string, startTime: Date, durationMinutes: number): Promise<boolean>;
}

// Could represent a calendar or scheduling system interface
export interface CalendarService {
  createEvent(subject: string, startTime: Date, endTime: Date, attendees: string[]): Promise<string>; // Returns event ID
  updateEvent(eventId: string, newStartTime: Date, newEndTime: Date): Promise<void>;
  cancelEvent(eventId: string): Promise<void>;
}

export class InterviewSchedulingService {
  private availabilityChecker: AvailabilityChecker;
  private calendarService?: CalendarService; // Optional: for integrating with external calendars

  constructor(availabilityChecker: AvailabilityChecker, calendarService?: CalendarService) {
    this.availabilityChecker = availabilityChecker;
    this.calendarService = calendarService;
  }

  public async scheduleInterview(
    candidateId: string,
    interviewerId: string,
    proposedTime: Date,
    durationMinutes: number,
    jobId?: string
  ): Promise<InterviewSession> {
    // 1. Check candidate availability
    if (!(await this.availabilityChecker.isSlotAvailable(candidateId, proposedTime, durationMinutes))) {
      throw new Error(`Candidate ${candidateId} is not available at the proposed time.`);
    }

    // 2. Check interviewer availability
    if (!(await this.availabilityChecker.isSlotAvailable(interviewerId, proposedTime, durationMinutes))) {
      throw new Error(`Interviewer ${interviewerId} is not available at the proposed time.`);
    }

    // 3. Create the InterviewSession entity (still in SCHEDULED state, not yet saved to DB)
    const newSession: Omit<InterviewSession, "id" | "createdAt" | "updatedAt"> = {
      candidateId,
      interviewerId,
      jobId,
      scheduledAt: proposedTime,
      status: InterviewStatus.SCHEDULED,
      // durationMinutes might be part of InterviewSettings VO later
    };

    // In a real scenario, an ID would be generated upon saving via a repository.
    // For now, we'll simulate it. The actual save operation would be in an application service
    // calling a repository method.
    const createdSession: InterviewSession = {
      ...newSession,
      id: `temp-id-${Date.now()}`, // Placeholder ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Optionally, create an event in an external calendar
    if (this.calendarService) {
      const endTime = new Date(proposedTime.getTime() + durationMinutes * 60000);
      try {
        const eventId = await this.calendarService.createEvent(
          `Interview: Candidate ${candidateId} / Interviewer ${interviewerId}`,
          proposedTime,
          endTime,
          [candidateId, interviewerId] // Assuming email or other identifier for attendees
        );
        // Store `eventId` in the InterviewSession or a related entity if needed for updates/cancellations.
        // e.g., createdSession.calendarEventId = eventId;
      } catch (error) {
        // Log the error, but maybe don't fail the whole scheduling if calendar integration fails
        console.error("Failed to create calendar event:", error);
      }
    }

    // The service returns the new session; the application layer would then persist it.
    // It might also emit a Domain Event like `InterviewScheduled`.
    return createdSession;
  }

  public async rescheduleInterview(
    sessionId: string,
    newTime: Date,
    // Assuming repositories are used by application service to fetch/save session
    currentSession: InterviewSession
  ): Promise<InterviewSession> {
    if (currentSession.status === InterviewStatus.COMPLETED || currentSession.status === InterviewStatus.CANCELLED) {
      throw new Error("Cannot reschedule a completed or cancelled interview.");
    }

    const durationMinutes = (currentSession.scheduledAt.getTime() - newTime.getTime()) / 60000; // Simplified, better to store duration

    if (!(await this.availabilityChecker.isSlotAvailable(currentSession.candidateId, newTime, durationMinutes))) {
      throw new Error(`Candidate ${currentSession.candidateId} is not available at the new proposed time.`);
    }
    if (!(await this.availabilityChecker.isSlotAvailable(currentSession.interviewerId, newTime, durationMinutes))) {
      throw new Error(`Interviewer ${currentSession.interviewerId} is not available at the new proposed time.`);
    }

    const updatedSession = {
      ...currentSession,
      scheduledAt: newTime,
      status: InterviewStatus.SCHEDULED, // Reset status if it was something else (e.g. PENDING_FEEDBACK from a no-show)
      updatedAt: new Date(),
    };

    // Optionally, update the calendar event via this.calendarService
    // if (this.calendarService && currentSession.calendarEventId) {
    //   await this.calendarService.updateEvent(...)
    // }

    // Return updated session; application layer persists.
    // Domain Event: InterviewRescheduled
    return updatedSession;
  }
}
