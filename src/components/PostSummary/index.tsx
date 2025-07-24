import {
  formatDatetime,
  formatRelativeDatetime,
} from "@/utils/format-datetime";
import { PostHeading } from "../PostHeading";
import { PostFormattedDate } from "../PostFormattedDate";

type PostSummaryProps = {
  postHeading: "h1" | "h2";
  postLink: string;
  createdAt: string;
  title: string;
  excerpt: string;
};

export function PostSummary({
  postHeading,
  postLink,
  createdAt,
  excerpt,
  title,
}: PostSummaryProps) {
  return (
    <div className="flex flex-col gap-5 sm:justify-center">
      <PostFormattedDate dateTime={createdAt} />
      <PostHeading url={postLink} as={postHeading}>
        {title}
      </PostHeading>
      <p>{excerpt}</p>
    </div>
  );
}
