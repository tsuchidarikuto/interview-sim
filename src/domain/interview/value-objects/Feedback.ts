// src/domain/interview/value-objects/Feedback.ts

export interface FeedbackProps {
  text: string;
  authorId?: string; // Optional: ID of the user who provided the feedback
  submittedAt?: Date; // Optional: Timestamp when feedback was submitted
  // category?: string; // Optional: e.g., "technical", "behavioral"
}

export class Feedback {
  public readonly text: string;
  public readonly authorId?: string;
  public readonly submittedAt?: Date;
  // public readonly category?: string;

  constructor(props: FeedbackProps) {
    if (props.text.trim().length === 0) {
      throw new Error("Feedback text cannot be empty.");
    }
    // Potentially add length constraints or other validation

    this.text = props.text;
    this.authorId = props.authorId;
    this.submittedAt = props.submittedAt || new Date();
    // this.category = props.category;

    // Freeze the object to ensure immutability
    Object.freeze(this);
  }

  public equals(other?: Feedback): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return (
      this.text === other.text &&
      this.authorId === other.authorId &&
      // Note: Date comparison needs care, this is a simple reference or value check if frozen
      this.submittedAt?.getTime() === other.submittedAt?.getTime()
      // && this.category === other.category
    );
  }

  // You might add methods like:
  // truncate(maxLength: number): string
  // containsKeyword(keyword: string): boolean
}
