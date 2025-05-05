export const formModel = {
  isLogin: true,

  toggleLoginState() {
    this.isLogin = !this.isLogin;
    return this.isLogin;
  },

  getEndpoint() {
    return this.isLogin ? "/login" : "/register";
  }
};
