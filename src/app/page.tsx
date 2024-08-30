import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import KanjiPairs from "./_components/kanjipairs/kanjipairs";

export default function Index() {
  return (
    <main>
      <Container>
        <Intro />
        <KanjiPairs />
      </Container>
    </main>
  );
}
