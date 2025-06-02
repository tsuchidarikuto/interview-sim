// src/domain/interview/value-objects/InterviewSettings.ts

export enum InterviewType {
  TECHNICAL = "technical",
  BEHAVIORAL = "behavioral",
  MIXED = "mixed",
  // Add more types as needed
}

export interface InterviewSettingsProps {
  durationMinutes: number; // Duration of the interview in minutes
  interviewType: InterviewType;
  isScreenRecordingEnabled?: boolean; // Is screen recording active
  isAudioRecordingEnabled?: boolean; // Is audio recording active
  // specificTools?: string[]; // e.g., ["CoderPad", "Google Meet"]
  // difficultyLevel?: string; // e.g., "Junior", "Senior"
}

export class InterviewSettings {
  public readonly durationMinutes: number;
  public readonly interviewType: InterviewType;
  public readonly isScreenRecordingEnabled: boolean;
  public readonly isAudioRecordingEnabled: boolean;
  // public readonly specificTools?: string[];
  // public readonly difficultyLevel?: string;

  constructor(props: InterviewSettingsProps) {
    if (props.durationMinutes <= 0) {
      throw new Error("Interview duration must be positive.");
    }

    this.durationMinutes = props.durationMinutes;
    this.interviewType = props.interviewType;
    this.isScreenRecordingEnabled = props.isScreenRecordingEnabled || false;
    this.isAudioRecordingEnabled = props.isAudioRecordingEnabled || false;
    // this.specificTools = Object.freeze(props.specificTools ? [...props.specificTools] : []); // Ensure array immutability
    // this.difficultyLevel = props.difficultyLevel;

    Object.freeze(this);
  }

  public equals(other?: InterviewSettings): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return (
      this.durationMinutes === other.durationMinutes &&
      this.interviewType === other.interviewType &&
      this.isScreenRecordingEnabled === other.isScreenRecordingEnabled &&
      this.isAudioRecordingEnabled === other.isAudioRecordingEnabled
      // && JSON.stringify(this.specificTools) === JSON.stringify(other.specificTools) // Careful with array comparison
      // && this.difficultyLevel === other.difficultyLevel
    );
  }

  // Method to update settings (returns a new instance)
  public changeDuration(newDuration: number): InterviewSettings {
    return new InterviewSettings({ ...this, durationMinutes: newDuration });
  }

  public enableScreenRecording(): InterviewSettings {
    return new InterviewSettings({ ...this, isScreenRecordingEnabled: true });
  }
}
