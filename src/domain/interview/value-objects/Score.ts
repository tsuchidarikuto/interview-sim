// src/domain/interview/value-objects/Score.ts

export interface ScoreProps {
  value: number;
  scaleMin?: number; // e.g., 1
  scaleMax?: number; // e.g., 5
  comment?: string; // Optional comment associated with the score
}

export class Score {
  public readonly value: number;
  public readonly scaleMin: number;
  public readonly scaleMax: number;
  public readonly comment?: string;

  constructor(props: ScoreProps) {
    if (props.scaleMin !== undefined && props.scaleMax !== undefined) {
      if (props.scaleMin >= props.scaleMax) {
        throw new Error("Score scale minimum must be less than scale maximum.");
      }
      if (props.value < props.scaleMin || props.value > props.scaleMax) {
        throw new Error(
          `Score value must be between ${props.scaleMin} and ${props.scaleMax}.`
        );
      }
    } else if (
      (props.scaleMin !== undefined && props.scaleMax === undefined) ||
      (props.scaleMin === undefined && props.scaleMax !== undefined)
    ) {
      throw new Error(
        "Both scaleMin and scaleMax must be provided if one is specified."
      );
    }

    this.value = props.value;
    this.scaleMin = props.scaleMin === undefined ? -Infinity : props.scaleMin;
    this.scaleMax = props.scaleMax === undefined ? Infinity : props.scaleMax;
    this.comment = props.comment;

    // Freeze the object to ensure immutability
    Object.freeze(this);
  }

  public equals(other?: Score): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return (
      this.value === other.value &&
      this.scaleMin === other.scaleMin &&
      this.scaleMax === other.scaleMax &&
      this.comment === other.comment
    );
  }

  // You could add other methods here, e.g.,
  // isBetterThan(other: Score): boolean
  // isWithinScale(value: number): boolean
}
