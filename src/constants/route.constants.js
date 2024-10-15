const APP_ROUTES = {
  ANY: "*",
  SLASH: "/",
  AUTHENTICATE_USER: "/api/users/*",
  AUTH: "/api/auth",
  USERS: "/api/users",
  POSTS: "/api/users/:userId/posts",
  LOGIN: "/login",
  USER: "/:userId",
  FOLLOWERS: "/:userId/followers",
  FOLLOWINGS: "/:userId/followings",
  FOLLOW: "/:userId/follow",
  UNFOLLOW: "/:userId/unfollow",
  SEARCH_USER: "/search/:searchQuery",
  NEWS_FEED: "/newsfeed",
  POST: "/:postId",
  LIKE: "/:postId/like",
  UNLIKE: "/:postId/unlike",
};

export { APP_ROUTES };
