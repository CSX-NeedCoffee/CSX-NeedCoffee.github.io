import { defineNoteConfig, defineNotesConfig } from "vuepress-theme-plume";

const demoNote = defineNoteConfig({
  dir: "demo",
  link: "/demo",
  sidebar: ["", "foo", "bar"],
});
const tools = defineNoteConfig({
  dir: "tools",
  link: "/tools",
  sidebar: ["", "git"],
});

export const notes = defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [demoNote, tools],
});
