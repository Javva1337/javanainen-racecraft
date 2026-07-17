import { describe, expect, test } from "vitest";
import matter from "gray-matter";
import {
  buildArticleEnMdx,
  buildArticleMdx,
  buildSlug,
  buildVmStatus,
  type RapportFalt,
  type RapportFaltEn,
} from "./publicera";

const falt: RapportFalt = {
  title: "Dag 3: Från P12 till P5 i regnet",
  description: "Två heat, ett regnoväder och en känsla av att det vänder.",
  date: "2026-07-24",
  day: 3,
  heatsRaced: 2,
  bestFinish: "P2",
  standing: "P5",
  nationsCup: "P3",
  tomorrow: "Imorgon väntar två heat till på en torrare bana.",
  body: "Starten i heat ett var det bästa jag gjort i år.\n\nAndra stycket här.",
};

describe("buildSlug", () => {
  test("bygger vm-dag-slug av dag + krok", () => {
    expect(buildSlug(3, "Från P12 till P5 i regnet")).toBe("vm-dag-3-fran-p12-till-p5-i-regnet");
  });

  test("tar bort ledande 'Dag N:' så dagen inte dubbleras", () => {
    expect(buildSlug(3, "Dag 3: Från P12 till P5")).toBe("vm-dag-3-fran-p12-till-p5");
  });

  test("hanterar åäö, skiljetecken och upprepade mellanslag", () => {
    expect(buildSlug(7, "Åska & öl — 100% klart!")).toBe("vm-dag-7-aska-ol-100-klart");
  });

  test("tom krok ger bara vm-dag-N", () => {
    expect(buildSlug(4, "Dag 4:")).toBe("vm-dag-4");
  });
});

describe("buildArticleMdx", () => {
  test("frontmattern överlever en gray-matter-rundresa oförändrad", () => {
    const { data, content } = matter(buildArticleMdx(falt));
    expect(data.title).toBe(falt.title);
    expect(data.description).toBe(falt.description);
    expect(data.date).toBe("2026-07-24");
    expect(data.category).toBe("VM 2026");
    expect(data.day).toBe(3);
    expect(data.heatsRaced).toBe(2);
    expect(data.bestFinish).toBe("P2");
    expect(data.standing).toBe("P5");
    expect(data.nationsCup).toBe("P3");
    expect(data.tomorrow).toBe(falt.tomorrow);
    expect(content.trim()).toBe(falt.body);
  });

  test("citattecken, kolon och radbrytning i rubriken knäcker inte YAML", () => {
    const svar: RapportFalt = {
      ...falt,
      title: 'Dag 5: "Kaos" i depån — 100%: attack',
      description: 'Rader:\nmed "citat" och \\snedstreck\\.',
    };
    const { data } = matter(buildArticleMdx(svar));
    expect(data.title).toBe(svar.title);
    expect(data.description).toBe(svar.description);
  });

  test("tomorrow utelämnas när den är tom (sista VM-dagen)", () => {
    const { data } = matter(buildArticleMdx({ ...falt, tomorrow: "  " }));
    expect(data.tomorrow).toBeUndefined();
  });

  test("image tas bara med när bild finns", () => {
    expect(matter(buildArticleMdx(falt)).data.image).toBeUndefined();
    const medBild = buildArticleMdx({ ...falt, imagePath: "/images/vm/vm-dag-3.jpg" });
    expect(matter(medBild).data.image).toBe("/images/vm/vm-dag-3.jpg");
  });
});

describe("buildVmStatus", () => {
  test("bygger statusobjektet med samma siffror som rapporten", () => {
    expect(buildVmStatus(falt)).toEqual({
      heatsRaced: 2,
      bestFinish: "P2",
      standing: "P5",
      nationsCupPosition: "P3",
      updatedAt: "2026-07-24",
    });
  });
});

const enFalt: RapportFaltEn = {
  title: "Day 3: From P12 to P5 in the rain",
  description: "Two heats, one downpour, and a feeling that things are turning.",
  tomorrow: "Two more heats on a drier track tomorrow.",
  body: "The start in heat one was the best I have done all year.\n\nSecond paragraph here.",
};

describe("buildArticleEnMdx", () => {
  test("engelska fält ersätter svenska — datum, kategori och siffror delas", () => {
    const { data, content } = matter(buildArticleEnMdx(falt, enFalt));
    expect(data.title).toBe(enFalt.title);
    expect(data.description).toBe(enFalt.description);
    expect(data.tomorrow).toBe(enFalt.tomorrow);
    expect(content.trim()).toBe(enFalt.body);
    // Delat med svenska rapporten:
    expect(data.date).toBe("2026-07-24");
    expect(data.category).toBe("VM 2026");
    expect(data.day).toBe(3);
    expect(data.standing).toBe("P5");
  });

  test("tom engelsk tomorrow utelämnas", () => {
    const { data } = matter(buildArticleEnMdx(falt, { ...enFalt, tomorrow: " " }));
    expect(data.tomorrow).toBeUndefined();
  });

  test("bildsökvägen följer med när den finns i falt", () => {
    const medBild = buildArticleEnMdx({ ...falt, imagePath: "/images/vm/vm-dag-3.jpg" }, enFalt);
    expect(matter(medBild).data.image).toBe("/images/vm/vm-dag-3.jpg");
  });
});
