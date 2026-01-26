import { defineNoteConfig, defineNotesConfig } from "vuepress-theme-plume";

const demoNote = defineNoteConfig({
  dir: "demo",
  link: "/demo",
  sidebar: ["", "foo", "bar"],
});
const tools = defineNoteConfig({
  dir: "tools",
  link: "/tools",
  sidebar: ["", "git", "npm"],
});

const jvm = defineNoteConfig({
  dir: "java/jvm",
  link: "/java/jvm",
  sidebar: ["","introduce/", "ClassTech/", "ClassLoader/", "MemoryStruc/", "GC/"],
});

const spring = defineNoteConfig({
  dir: "java/spring",
  link: "/java/spring",
  sidebar: ["", "ioc/", "aop/"],
});


const front = defineNoteConfig({
  dir: "front",
  link: "/front",
  sidebar: [""],
});

export const notes = defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [demoNote, tools, jvm, front, spring],
});
