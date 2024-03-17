import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SocialAuthController from '#controllers/social_auth_controller'

router.on('/').render('pages/home').as('home')

router.get('/register', [AuthController, 'register']).use(middleware.guest())
router.post('/register', [AuthController, 'handleRegister']).use(middleware.guest())
router.get('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest())
router.post('/login', [AuthController, 'handleLogin']).use(middleware.guest())

router
  .get('/github/redirect', [SocialAuthController, 'githubRedirect'])
  .use(middleware.guest())
  .as('github.redirect')
router
  .get('/github/callback', [SocialAuthController, 'githubCallback'])
  .use(middleware.guest())
  .as('github.callback')

router
  .get('/google/redirect', [SocialAuthController, 'googleRedirect'])
  .use(middleware.guest())
  .as('google.redirect')
router
  .get('/google/callback', [SocialAuthController, 'googleCallback'])
  .use(middleware.guest())
  .as('google.callback')

router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
