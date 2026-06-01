type GreetingProps = {
  firstName: string;
};

export default function Greeting({ firstName }: GreetingProps) {
  const now = new Date();
  const month = now.toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="px-1">
      <p className="text-sm text-gray-400">Benvenuto, {firstName}</p>
      <p className="text-xl font-semibold capitalize">{month}</p>
    </div>
  );
}
