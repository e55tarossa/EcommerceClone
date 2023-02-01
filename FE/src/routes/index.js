import AdminPage from "../pages/AdminPage/AdminPage";
import HomePage from "../pages/Homepage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
    {
        path:"/",
        page: HomePage,
        isShowHeader : true
    },
    {
        path:"/order",
        page: OrderPage,
        isShowHeader : true
    },
    {
        path:"/products",
        page: ProductsPage,
        isShowHeader : true
    },
    {
        path:"/sign-in",
        page: SignInPage,
        isShowHeader : false
    },
    {
        path:"/sign-up",
        page: SignUpPage,
        isShowHeader : false
    },
    {
        path:"/product-details/:id",
        page: ProductDetailsPage,
        isShowHeader : true
    },
    {
        path:"/profile-user",
        page: ProfilePage,
        isShowHeader : true
    },
    {
        path:"/:type",
        page: TypeProductPage,
        isShowHeader : true
    },
    {
        path:"/system/admin",
        page: AdminPage,
        isPrivate: true
    },
    {
        path:"*",
        page: NotFoundPage
    }
]