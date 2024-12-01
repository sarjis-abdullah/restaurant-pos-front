// composables/useMenu.js

import { reactive, shallowRef, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  XMarkIcon,
  PlusIcon,
  BuildingOfficeIcon,
  DocumentChartBarIcon,
  TableCellsIcon,
  BanknotesIcon,
} from "@heroicons/vue/24/outline";
import CategoryIcon from "@/components/icon/CategoryIcon.vue";
import FloorIcon from "@/components/icon/FloorIcon.vue";
import TariffIcon from "@/components/icon/TariffIcon.vue";
import SlotIcon from "@/components/icon/SlotIcon.vue";
import ParkingIcon from "@/components/icon/ParkingIcon.vue";
import cashflowIcon from "@/assets/cash-flow.png";
import reportIcon from "@/assets/report.png";
import customerPointsIcon from "@/assets/customerPoints.png";
import memberTypeIcon from "@/assets/memberType.png";
const category = ``;

const authUser = computed(()=> {
  if (window && window.localStorage && localStorage.getItem("LOGIN_ACCOUNT")) {
    return JSON.parse(localStorage.getItem("LOGIN_ACCOUNT"))
  }
  return null
});

const operator = computed(()=> authUser.value?.roles?.find(item => item?.name == 'operator'))
const superAdmin = computed(()=> authUser.value?.roles?.find(item => item?.name == 'super_admin'))

export {
  authUser,
  operator,
  superAdmin
}
export const useMenu = () => {
  const router = useRouter();
  const cashflow = {
    name: "Cashflow",
    href: "/cashflow",
    icon: shallowRef(UserGroupIcon),
    imageIcon: cashflowIcon,
    show: false,
    children: [
      { name: "Start", href: "/add/cashflow", icon: PlusIcon },
      { name: "List", href: "/cashflow", icon: TableCellsIcon },
    ],
  }
  const parking = {
    name: "Parking",
    href: "/parking",
    icon: shallowRef(ParkingIcon),
    show: false,
    children: [
      { name: "Add", href: "/add/parking", icon: PlusIcon },
      { name: "List", href: "/parking", icon: TableCellsIcon },
    ],
  }
  const state = reactive({
    menuItems: !authUser.value ? [] : operator.value?.name ? [cashflow, parking] : [
      // { name: "Dashboard", href: "/dashboard", icon: HomeIcon, show: false },
      {
        name: "User",
        href: "/user",
        show: false,
        children: [
          { name: "Add", href: "/add/user", icon: PlusIcon },
          { name: "List", href: "/user", icon: TableCellsIcon },
        ],
      },
      {
        name: "Branch",
        href: "/branch",
        show: false,
        children: [
          { name: "Add", href: "/add/branch", icon: PlusIcon },
          { name: "List", href: "/branch", icon: TableCellsIcon },
        ],
      },
      {
        name: "Category",
        href: "/category",
        show: false,
        children: [
          { name: "Add", href: "/add/category", icon: PlusIcon },
          { name: "List", href: "/category", icon: TableCellsIcon },
        ],
      },
      // {
      //   name: "Floor",
      //   href: "/floor",
      //   show: false,
      //   children: [
      //     { name: "Add", href: "/add/floor", icon: PlusIcon },
      //     { name: "List", href: "/floor", icon: TableCellsIcon },
      //   ],
      // },
      
      // {
      //   name: "Member type",
      //   href: "/membership",
      //   imageIcon: memberTypeIcon,
      //   show: false,
      //   children: [
      //     { name: "Add", href: "/add/membership-type", icon: PlusIcon },
      //     { name: "List", href: "/membership-type", icon: TableCellsIcon },
      //   ],
      // },
      // {
      //   name: "Membership",
      //   href: "/membership",
      //   icon: shallowRef(UserGroupIcon),
      //   show: false,
      // },
      {
        name: "Discount",
        href: "/discount",
        show: false,
        children: [
          { name: "Add", href: "/add/discount", icon: PlusIcon },
          { name: "List", href: "/discount", icon: TableCellsIcon },
        ],
      },
      {
        name: "Tax",
        href: "/tax",
        show: false,
        children: [
          { name: "Add", href: "/add/tax", icon: PlusIcon },
          { name: "List", href: "/tax", icon: TableCellsIcon },
        ],
      },
      {
        name: "Menu",
        href: "/menu",
        show: false,
        children: [
          { name: "Add", href: "/add/menu", icon: PlusIcon },
          { name: "List", href: "/menu", icon: TableCellsIcon },
        ],
      },
      {
        name: "MenuItem",
        href: "/menu-item",
        show: false,
        children: [
          { name: "Add", href: "/add/menu-item", icon: PlusIcon },
          { name: "List", href: "/menu-item", icon: TableCellsIcon },
        ],
      },
      // parking,
      // {
      //   name: "Reporting",
      //   href: "/reporting",
      //   // icon: shallowRef(ParkingIcon),
      //   imageIcon: reportIcon,
      //   show: false,
      //   children: [
      //     { name: "Transaction reports", href: "/transaction-reports", icon: PlusIcon },
      //     { name: "Vehicle reports", href: "/vehicle-reports", icon: TableCellsIcon },
      //   ],
      // },
      cashflow
      // {
      //   name: "Reports",
      //   href: "/reports",
      //   icon: DocumentChartBarIcon,
      //   show: false,
      // },
    ],
  });

  const toggleMenu = (index) => {
    state.menuItems = state.menuItems.map((item, i) => {
      item.show = i === index ? !item.show : false;
      return item;
    });
  };

  const setActiveMenu = () => {
    state.menuItems.forEach((item, index) => {
      if (item.children) {
        item.show = item.children.some(
          (child) => child.href === router.currentRoute.value.path
        );
      } else {
        item.show = item.href === router.currentRoute.value.path;
      }
    });
  };

  return { state, toggleMenu, setActiveMenu };
};
