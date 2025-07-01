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

const java = defineNoteConfig({
  dir: "java",
  link: "/java",
  sidebar: ["", "juc/"],
});

export const notes = defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [demoNote, tools, java],
});
