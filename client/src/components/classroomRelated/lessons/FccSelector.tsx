import network from "../../../helpers/network";

export async function fetchSuperChallenges() {
  let challengeMap: any[] = [];
  const { data: pageData } = await network.get(
    "https://www.freecodecamp.org/page-data/learn/page-data.json"
  );
  let cache = pageData.result.data.allChallengeNode.edges;
  cache.forEach(({ node: challenge }: { node: any }) => {
    if (
      !challengeMap.find(
        (superBlock: any) => superBlock.name === challenge.superBlock
      )
    ) {
      challengeMap.push({
        name: challenge.superBlock,
        challenges: [
          {
            name: challenge.fields.blockName,
            dashedName: challenge.block,
            subChallenges: [
              {
                name: challenge.title,
                dashedName: challenge.dashedName,
              },
            ],
          },
        ],
      });
    } else {
      challengeMap.forEach((superBlock, superBlockIndex) => {
        const blockIndex = superBlock.challenges.findIndex(
          (block: any) => block.name === challenge.fields.blockName
        );
        if (blockIndex !== -1) {
          if (
            !challengeMap[superBlockIndex].challenges[
              blockIndex
            ].subChallenges.find(
              (subChallenge: any) => subChallenge.name === challenge.title
            )
          ) {
            challengeMap[superBlockIndex].challenges[
              blockIndex
            ].subChallenges.push({
              name: challenge.title,
              dashedName: challenge.dashedName,
            });
          }
        } else if (superBlock.name === challenge.superBlock) {
          challengeMap[superBlockIndex].challenges.push({
            name: challenge.fields.blockName,
            dashedName: challenge.block,
            subChallenges: [
              {
                name: challenge.title,
                dashedName: challenge.dashedName,
              },
            ],
          });
        }
      });
    }
  });

  return challengeMap;
}
