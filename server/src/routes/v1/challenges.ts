import { Router, Request, Response } from "express";
//@ts-ignore
import { Form } from "../../models";
import { IForm } from "../../types";
import { Sequelize, Op } from "sequelize";
import axios from "axios";
const router = Router();
require("dotenv").config();

const { CM_ACCESS } = process.env;

if (!CM_ACCESS) {
  console.trace("ChallengeMe Access Token Missing!");
}
const challengeMe = "http://35.239.15.221:8080/api/v1";

router.get("/challengeMe", async (req: Request, res: Response) => {
  try {
    const { name: query } = req.query;
    const url = `${challengeMe}/challenges${query ? "?name=" + query : ""}`;
    console.log(query);
    console.log(url);
    const { data } = await axios.get(url, {
      headers: {
        authorization: CM_ACCESS,
      },
    });
    const challenges = data.map((challenge: any) => {
      const { id: value, name: label } = challenge;
      return { label, value: String(value) };
    });
    res.json(challenges);
  } catch (error) {
    console.trace(error);
    res.json({ status: "error", message: error.message });
  }
});

router.get("/quiz", async (req: Request, res: Response) => {
  const { name: query } = req.query;
  try {
    const data: IForm[] = await Form.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      order: [["createdAt", "DESC"]],
    });
    const forms = data.map((form) => {
      const { id: value, name: label } = form;
      return { label, value: String(value) };
    });
    res.json(forms);
  } catch (error) {
    console.trace(error);
    res.json({ status: "error", message: error.message });
  }
});

router.get("/fccsingle", async (req: Request, res: Response) => {
  try {
    const fccArray = await fetchBulkFcc();
    res.json(fccArray);
  } catch (error) {
    console.trace(error);
    res.json({ status: "error", message: error.message });
  }
});

router.get("/fcc", async (req: Request, res: Response) => {
  try {
    const fccArray = await fetchBlockChallenges();
    res.json(fccArray);
  } catch (error) {
    console.trace(error);
    res.json({ status: "error", message: error.message });
  }
});

export async function fetchBulkFcc() {
  const { data: pageData } = await axios.get(
    "https://www.freecodecamp.org/page-data/learn/page-data.json"
  );

  const formatedChallenges: any[] = pageData.result.data.allChallengeNode.edges.map(
    (chlng: any) => {
      const link = chlng.node.fields.slug;
      const title = chlng.node.title;
      const id = chlng.node.id;
      console.log(id);
      return { label: title, value: id, link };
    }
  );

  return formatedChallenges;
}
export async function fetchSuperChallenges() {
  let challengeMap: any[] = [];
  const { data: pageData } = await axios.get(
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
                id: challenge.id,
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

export async function fetchBlockChallengesGuy() {
  let challengeMap: any[] = [];
  const { data: pageData } = await axios.get(
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
        label: challenge.superBlock,
        challenges: [
          {
            label: challenge.fields.blockName,
            dashedName: challenge.block,
            value: "id" + challenge.block,
          },
        ],
      });
    } else {
      challengeMap.forEach((superBlock, superBlockIndex) => {
        const blockIndex = superBlock.challenges.findIndex(
          (block: any) => block.name === challenge.fields.blockName
        );
        if (blockIndex !== -1) {
          if (!challengeMap[superBlockIndex].challenges[blockIndex]) {
            challengeMap[superBlockIndex].challenges[blockIndex];
          }
        } else if (superBlock.name === challenge.superBlock) {
          challengeMap[superBlockIndex].challenges.push({
            name: challenge.fields.blockName,
            dashedName: challenge.block,
            id: "ide" + challenge.block,
          });
        }
      });
    }
  });

  return challengeMap;
}

export async function fetchBlockChallenges() {
  let challengeMap: any[] = [];
  const { data: pageData } = await axios.get(
    "https://www.freecodecamp.org/page-data/learn/page-data.json"
  );

  let cache = pageData.result.data.allMarkdownRemark.edges;
  // console.log(cache);

  const fccBulkArr = cache.map(({ node: challenge }: { node: any }) => {
    const idarr = challenge.fields.slug.split("/");
    const id = idarr[3];
    console.log(id);

    const newChallenge = {
      label: challenge.frontmatter.title.substring(16),
      value: "id" + id,
      link: challenge.fields.slug,
    };

    return newChallenge;
  });

  return fccBulkArr;
}
export default router;
