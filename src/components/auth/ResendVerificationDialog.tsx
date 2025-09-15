import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  triggerName: string;
};

const ResendVerificationDialog = ({ triggerName }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">{triggerName}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your registered email</DialogTitle>
        </DialogHeader>

        {/* put by form here with email field */}

        <DialogFooter>
          <DialogClose></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResendVerificationDialog;

/*

Why we use aschild prop in shadcn ui ?

Say you want a shadcn Button but it should behave like a react-router-dom <Link>.

Without asChild, you’d nest them → ugly and not semantic:

<Button>
  <Link to="/dashboard">Dashboard</Link>
</Button>


This renders:

<button>
  <a href="/dashboard">Dashboard</a>
</button>


⚠️ Invalid HTML (button inside link).

With asChild:

<Button asChild>
  <Link to="/dashboard">Dashboard</Link>
</Button>


This renders:

<a href="/dashboard" class="btn-classes">Dashboard</a>


✅ No extra wrapper, styling from Button is applied directly to <Link>.

*/
