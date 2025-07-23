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

const ScoreItem = ({
  label,
  score,
  icon,
  color,
}: {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}) => {
  const percentage = Math.round(score); // Score is already in 0-100 range

  return (
    <div className='bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between mb-4'>
        <div
          className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
        <div className='text-right'>
          <div className='text-2xl font-bold text-gray-900'>
            {score.toFixed(1)}
          </div>
          <div className='text-sm text-gray-500'>{percentage}%</div>
        </div>
      </div>

      <div className='mb-3'>
        <div className='flex justify-between items-center mb-1'>
          <span className='text-sm font-medium text-gray-700'>{label}</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${color.replace(
              "bg-",
              "bg-"
            )}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className='text-xs text-gray-500'>
        {percentage >= 80
          ? "Excellent"
          : percentage >= 60
          ? "Good"
          : percentage >= 40
          ? "Fair"
          : "Needs Improvement"}
      </div>
    </div>
  );
};

export default function ScoreCard({ candidate }: ScoreCardProps) {
  if (!candidate) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-xl p-6 shadow-sm border animate-pulse'
          >
            <div className='h-4 bg-gray-200 rounded mb-2'></div>
            <div className='h-8 bg-gray-200 rounded'></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    accuracyScore,
    pronounciationScore,
    fluencyScore,
    completenessScore,
  } = candidate;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
      <ScoreItem
        label='Accuracy'
        score={accuracyScore}
        color='bg-blue-500'
        icon={
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        }
      />

      <ScoreItem
        label='Pronunciation'
        score={pronounciationScore}
        color='bg-green-500'
        icon={
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z'
            />
          </svg>
        }
      />

      <ScoreItem
        label='Fluency'
        score={fluencyScore}
        color='bg-purple-500'
        icon={
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </svg>
        }
      />

      <ScoreItem
        label='Completeness'
        score={completenessScore}
        color='bg-orange-500'
        icon={
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
        }
      />
    </div>
  );
}
