interface Candidate {
  context: string;
  accuracyScore: number;
  pronounciationScore: number;
  fluencyScore: number;
  completenessScore: number;
  nextQuestion: string;
}

// ScoreCard now only takes one prop: candidate
type ScoreCardProps = {
  candidate?: Candidate | null;
};
export default function ScoreCard({ candidate }: ScoreCardProps) {
  if (!candidate) return null;
  const {
    context,
    accuracyScore,
    pronounciationScore,
    fluencyScore,
    completenessScore,
    nextQuestion,
  } = candidate;
  return (
    <div className='flex justify-center gap-10'>
      <p>Accuracy Score: {candidate.accuracyScore}</p>
      <p>Pronunciation Score: {candidate?.pronounciationScore}</p>
      <p>Fluency Score: {candidate?.fluencyScore}</p>
      <p>Completeness Score: {candidate?.completenessScore}</p>{" "}
    </div>
  );
}
