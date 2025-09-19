import { CircleAlertIcon, XIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  onClose: () => void;
};

const EmailActionAlert = ({ title, description, onClose }: Props) => {
  return (
    <Alert variant="info">
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute right-0"
      >
        <XIcon />
        <span className="sr-only">Close</span>
      </Button>
    </Alert>
  );
};

export default EmailActionAlert;

/*

🔹 Union (|) = OR

A union means a value can be one type OR another.

type Dog = { bark: () => void };
type Cat = { meow: () => void };

type Pet = Dog | Cat;


If you say something is a Pet, it can be either a Dog or a Cat.


🔹 Intersection (&) = AND

An intersection means a value must be all types at the same time.

type WithName = { name: string };
type WithAge = { age: number };

type Person = WithName & WithAge;


A Person must have both a name and an age.
*/
