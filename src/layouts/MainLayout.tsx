import { defineComponent } from "vue";
import { RouterLink, RouterView } from "vue-router";

const MainLayout = defineComponent({
  name: "MainLayout",
  setup() {
    return () => (
      <div class="flex min-h-screen bg-white text-gray-900 md:flex-row dark:bg-gray-800 dark:text-gray-100">
        {/* sidebar */}
        <div class="flex space-x-4 bg-gray-100 p-4 md:flex-col md:space-y-4 md:space-x-0 dark:bg-gray-900">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/develop">Develop</RouterLink>
        </div>

        {/* content */}
        <div class="flex-1 p-4 dark:bg-gray-900">
          <RouterView />
        </div>
      </div>
    );
  },
});

export default MainLayout;
