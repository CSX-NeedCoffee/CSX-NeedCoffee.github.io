import { defineClientConfig } from "vuepress/client";
// import RepoCard from 'vuepress-theme-plume/features/RepoCard.vue'
// import NpmBadge from 'vuepress-theme-plume/features/NpmBadge.vue'
// import NpmBadgeGroup from 'vuepress-theme-plume/features/NpmBadgeGroup.vue'
// import Swiper from 'vuepress-theme-plume/features/Swiper.vue'

// import CustomComponent from './theme/components/Custom.vue'

// import './theme/styles/custom.css'
import HomePage from "./theme/components/HomePage.vue";
import CardContainer from "./theme/components/CardContainer.vue";
import LinkCard from "./theme/components/LinkCard.vue";
import ProjectItem from "./theme/components/ProjectItem.vue";
import MySwitch from "./theme/components/MySwitch.vue";
import CTable from "./theme/components/CTable.vue";

export default defineClientConfig({
  enhance({ app }) {
    // built-in components
    // app.component('RepoCard', RepoCard)
    // app.component('NpmBadge', NpmBadge)
    // app.component('NpmBadgeGroup', NpmBadgeGroup)
    // app.component('Swiper', Swiper) // you should install `swiper`

    // your custom components
    app.component("HomePage", HomePage);
    app.component("CardContainer", CardContainer);
    app.component("LinkCard", LinkCard);
    app.component("ProjectItem", ProjectItem);
    app.component("MySwitch", MySwitch);
    app.component("CTable", CTable);
  },
});
