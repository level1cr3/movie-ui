import ResendVerificationDialog from "@/components/auth/ResendVerificationDialog";

const Home = () => {
  return (
    <div>
      Home
      <ResendVerificationDialog triggerName="Resend verification email" />
    </div>
  );
};

export default Home;
