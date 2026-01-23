import { defineComponent } from "vue";
import { RouterView } from "vue-router";

const App = defineComponent({
  setup() {
    const modules = import.meta.glob("../dev_docs/**/*.md", { query: "?raw", eager: true }) as Record<string, string>;
    for (const key of Object.keys(modules)) {
      const value = modules[key];
    }
    return () => <RouterView />;
  },
});

export default App;
