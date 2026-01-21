import { defineComponent } from "vue";
import { RouterView } from "vue-router";

const MainLayout = defineComponent({
  name: "MainLayout",
  setup() {
    return () => (
      <div>
        <RouterView />
      </div>
    );
  },
});

export default MainLayout;
