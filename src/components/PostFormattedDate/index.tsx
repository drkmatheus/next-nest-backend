import {
  formatDatetime,
  formatRelativeDatetime,
} from "@/utils/format-datetime";

type PostFormattedDateProps = {
  dateTime: string;
};

export function PostFormattedDate({ dateTime }: PostFormattedDateProps) {
  return (
    <time
      className="text-slate-600 text-sm/tight"
      dateTime={dateTime}
      title={formatRelativeDatetime(dateTime)}
    >
      {formatDatetime(dateTime)}
    </time>
  );
}
