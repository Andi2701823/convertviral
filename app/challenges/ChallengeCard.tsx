'use client';

import { UserChallenge } from '@/lib/gamification';

interface ChallengeCardProps {
  userChallenge: UserChallenge;
  getChallengeEmoji: (type: string) => string;
  getChallengeColor: (points: number) => string;
  getChallengeDifficulty: (points: number) => string;
  formatTimeRemaining: (assignedAt?: Date) => string;
  formatRelativeTime: (date: Date) => string;
}

export default function ChallengeCard({
  userChallenge,
  getChallengeEmoji,
  getChallengeColor,
  getChallengeDifficulty,
  formatTimeRemaining,
  formatRelativeTime
}: ChallengeCardProps) {
  const { challenge, progress, completed, completedAt } = userChallenge;
  const progressPercentage = Math.min(100, Math.round((progress / challenge.requirement) * 100));
  const emoji = getChallengeEmoji(challenge.type);

  return (
    <div className={`p-6 rounded-lg border ${completed ? 'border-accent-500' : 'border-surface-200'} hover:shadow-md transition-shadow`}>
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getChallengeColor(challenge.points)}`}>
          <span className="text-2xl">{emoji}</span>
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-lg text-surface-800">{challenge.title}</h3>
          <p className="text-sm text-surface-500">{challenge.description}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-surface-700">
            Progress: {progress} / {challenge.requirement}
          </span>
          <span className="text-sm font-medium text-surface-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-surface-200 rounded-full h-2.5">
          <div
            className={`${completed ? 'bg-accent-600' : 'bg-primary-600'} h-2.5 rounded-full`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getChallengeColor(challenge.points)} text-white`}>
            {getChallengeDifficulty(challenge.points)}
          </span>
          <span className="text-xs text-surface-500">{challenge.points} XP</span>
        </div>

        {completed ? (
          <span className="text-xs text-accent-600 font-medium">
            Completed {completedAt && formatRelativeTime(completedAt)}
          </span>
        ) : (
          <span className="text-xs text-yellow-600 font-medium">
            {formatTimeRemaining()}
          </span>
        )}
      </div>
    </div>
  );
}