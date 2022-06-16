import {App} from 'modules/app';
import {
  List as ProductList,
  Create as ProductCreate,
  Edit as ProductEdit,
  View as ProductView,
} from 'modules/products';
import {
  View as CategoryView,
  List as CategoryList,
  Edit as CategoryEdit,
  Create as CategoryCreate,
} from 'modules/categories';
import {List as ShopList, Create as ShopCreate, View as ShopView, Edit as ShopEdit} from 'modules/shops';
import {
  List as SlideshowList,
  Create as SlideshowCreate,
  View as SlideshowView,
  Edit as SlideshowEdit,
  Command as SlideshowCommand,
} from 'modules/slideshow';
import {
  List as SlideList,
  Create as SlideCreate,
  View as SlideView,
  Edit as SlideEdit,
  Reorder as SlideOrder,
} from 'modules/slides';
import {
  List as LabelList,
  Create as LabelCreate,
  View as LabelView,
  Edit as LabelEdit,
} from 'modules/labels';
import {List as DesignsList} from 'modules/designs';
import {List as OptionsList} from 'modules/options';
import {Support} from 'modules/support';
import {User} from 'modules/user';
import {NotFound} from 'modules/notFound';
import {License} from 'modules/license';

const routes = [
  {
    path: '/auth/:uuid/:license',
    component: User,
  },
  {
    path: '/support',
    component: Support,
  },
  {
    path: '/',
    component: App,
    routes: [
      {
        path: '/license',
        component: License,
      },
      {
        path: '/slideshow/:slideshowId/slides/edit/:slideId',
        component: SlideEdit,
      },
      {
        path: '/slideshow/:slideshowId/slides/view/:slideId',
        component: SlideView,
      },
      {
        path: '/slideshow/:slideshowId/slides/reorder',
        component: SlideOrder,
      },
      {
        path: '/slideshow/:slideshowId/slides/create',
        component: SlideCreate,
      },
      {
        path: '/slideshow/:slideshowId/slides',
        component: SlideList,
      },
      {
        path: '/slideshow/command/:slideshowId',
        component: SlideshowCommand,
      },
      {
        path: '/slideshow/edit/:slideshowId',
        component: SlideshowEdit,
      },
      {
        path: '/slideshow/view/:slideshowId',
        component: SlideshowView,
      },
      {
        path: '/slideshow/create',
        component: SlideshowCreate,
      },
      {
        path: '/slideshow',
        component: SlideshowList,
      },
      {
        path: '/products/view/:id',
        component: ProductView,
      },
      {
        path: '/products/edit/:id',
        component: ProductEdit,
      },
      {
        path: '/products/create',
        component: ProductCreate,
      },
      {
        path: '/products',
        component: ProductList,
      },
      {
        path: '/categories/:categoryId/labels/edit/:labelId',
        component: LabelEdit,
      },
      {
        path: '/categories/:categoryId/labels/view/:labelId',
        component: LabelView,
      },
      {
        path: '/categories/:categoryId/labels/create',
        component: LabelCreate,
      },
      {
        path: '/categories/:categoryId/labels',
        component: LabelList,
      },
      {
        path: '/categories/view/:id',
        component: CategoryView,
      },
      {
        path: '/categories/edit/:id',
        component: CategoryEdit,
      },
      {
        path: '/categories/create',
        component: CategoryCreate,
      },
      {
        path: '/categories',
        component: CategoryList,
      },
      {
        path: '/shops/edit/:id',
        component: ShopEdit,
      },
      {
        path: '/shops/view/:id',
        component: ShopView,
      },
      {
        path: '/shops/create',
        component: ShopCreate,
      },
      {
        path: '/shops',
        component: ShopList,
      },
      {
        path: '/designs',
        component: DesignsList,
      },
      {
        path: '/options',
        component: OptionsList,
      },
      {
        path: '/notFound',
        component: NotFound,
      },
    ],
  },
];

export default routes;
