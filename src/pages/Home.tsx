import FocusedPageContainer from "@/components/common/FocusedPageContainer";
import { useBearStore } from "@/stores/counterStore";
import { useState } from "react";

const Home = () => {
  const bears = useBearStore((state) => state.bears);
  const increasePopulation = useBearStore((state) => state.increasePopulation);

  const [count, setCount] = useState(0);

  return (
    <FocusedPageContainer>
      <h1>
        {bears} bears around here... here is count: {count}
      </h1>{" "}
      <button onClick={increasePopulation}>click me</button>
      <button onClick={() => setCount(count + 1)}>click</button>
    </FocusedPageContainer>
  );
};

export default Home;
