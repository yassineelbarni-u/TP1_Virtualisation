type PresentationProps = {
  title: string;
  description: string;
};

export function Presentation({ title, description }: PresentationProps) {
  return (
    <section className="presentation">
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
