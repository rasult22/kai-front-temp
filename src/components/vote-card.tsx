import { Check, ChevronUp } from "@untitledui/icons";
import { Badge } from "./base/badges/badges";
import { Button } from "./base/buttons/button";
import { AvatarLabelGroup } from "./base/avatar/avatar-label-group";
import { useState } from "react";
import WebApp from "@twa-dev/sdk";
import { voteQuestion } from "@/queries/questions";
import { queryClient } from "@/queries";

export default function VoteCard({index, voteCount, isVoted, questionTitle, photo_url, fullname, created_at, question_id, event_id}:{index: number, voteCount: number, isVoted: boolean, questionTitle: string, photo_url: string, fullname: string, created_at: string, question_id: number, event_id: number}) {
  const [isVotedLocal, setIsVoted] = useState(isVoted);
  const [voteCountLocal, setVoteCount] = useState(voteCount);

  const onVote = async () => {
    if (isVoted) return;
    WebApp.HapticFeedback.impactOccurred('medium')
    setVoteCount(voteCount + 1);
    setIsVoted(true)
    await voteQuestion(question_id)
    queryClient.invalidateQueries({ queryKey: ['questions', event_id]})
  }
  return <div className="border border-primary bg-primary_hover rounded-[16px]">
    <div className="p-3">
      {/* header */}
      <div className="flex gap-3 items-center">
        {index === 1 && <Badge color="warning"> {index} место </Badge>}
        {index === 2 && <Badge color="brand"> {index} место </Badge>}
        {index === 3 && <Badge color="brand"> {index} место </Badge>}
        {index > 3 && <Badge> {index} место </Badge>}
        <div className="flex gap-2 items-center">
          <div className="text-secondary text-[14px] leading-[20px]">{voteCountLocal} {getVoiceDeclension(voteCountLocal)}</div>
          <ChevronUp size={20} className="text-utility-brand-600" />
        </div>
      </div>
      {/* text */}
      <div className="text-[14px] leading-[20px] mt-3 font-medium text-primary max-w-[85%]">
        {questionTitle}
      </div>
      {/* button */}
      {isVotedLocal &&  <Button className="mt-3 bg-bg-primary text-secondary border border-primary before:hidden outline-none focus-visible:outline-none shadow-none" iconLeading={<Check size={20} className="text-fg-quaternary"/>}>
        Проголосовано
      </Button>}
      {!isVotedLocal && <Button onClick={onVote} className="mt-3" iconLeading={<ChevronUp  size={20} className="text-button-primary-icon"/>}>
        Проголосовать
      </Button>}
    </div>
    {/* User */}
    <div className="p-3 border-t border-primary flex">
      <AvatarLabelGroup
        size="sm"
        src={
          photo_url
        }
        alt="user name"
        title={fullname}
        subtitle="Участник слёта"
      />
      <div className="self-end text-tertiary text-[12px] leading-[18px]">{formatTime(created_at)}</div>
    </div>
  </div>
}

function getVoiceDeclension(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'голосов';
  }

  if (lastDigit === 1) {
    return 'голос';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'голоса';
  }

  return 'голосов';
}

const formatTime = (created_at: string) => {
  const date = new Date(created_at);
  const hours = (date.getUTCHours() + 4).toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}