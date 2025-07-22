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
    accuracyScore,
    pronounciationScore,
    fluencyScore,
    completenessScore,
  } = candidate;
  return (
    <div className='flex justify-center gap-10'>
      <p>Accuracy Score: {accuracyScore}</p>
      <p>Pronunciation Score: {pronounciationScore}</p>
      <p>Fluency Score: {fluencyScore}</p>
      <p>Completeness Score: {completenessScore}</p>{" "}
    </div>
  );
}
