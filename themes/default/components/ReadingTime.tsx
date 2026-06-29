type ReadingTimeProps = {
  minutes: number;
};

export default function DefaultReadingTime({ minutes }: ReadingTimeProps) {
  return <span>{minutes} min read</span>;
}
