import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SocialAuthController {
  githubRedirect({ ally }: HttpContext) {
    ally.use('github').redirect((req) => {
      req.scopes(['user'])
    })
  }

  googleRedirect({ ally }: HttpContext) {
    ally.use('google').redirect((req) => {
      req.scopes(['user'])
    })
  }

  async githubCallback({ ally, response, session, auth }: HttpContext) {
    const gh = ally.use('github')

    if (gh.accessDenied()) {
      session.flash('success', 'Tu as annulé la connexion avec Github')
      return response.redirect().toRoute('auth.login')
    }

    if (gh.stateMisMatch()) {
      session.flash('success', "Erreur d'accès")
      return response.redirect().toRoute('auth.login')
    }

    if (gh.hasError()) {
      session.flash('success', "Erreur d'accès")
      return response.redirect().toRoute('auth.login')
    }

    const githubUser = await gh.user()
    const user = await User.findBy('email', githubUser.email)
    if (!user) {
      const newUser = await User.create({
        username: githubUser.name,
        email: githubUser.email,
        thumbnail: githubUser.avatarUrl,
      })
      await auth.use('web').login(newUser)
    }

    await auth.use('web').login(user!)
    session.flash('success', 'Connecté avec github')
    return response.redirect().toRoute('home')
  }

  async googleCallback({ ally, response, session, auth }: HttpContext) {
    const go = ally.use('google')

    if (go.accessDenied()) {
      session.flash('success', 'Tu as annulé la connexion avec Google')
      return response.redirect().toRoute('auth.login')
    }

    if (go.stateMisMatch()) {
      session.flash('success', "Erreur d'accès")
      return response.redirect().toRoute('auth.login')
    }

    if (go.hasError()) {
      session.flash('success', "Erreur d'accès")
      return response.redirect().toRoute('auth.login')
    }

    const googleUser = await go.user()
    const user = await User.findBy('email', googleUser.email)
    if (!user) {
      const newUser = await User.create({
        username: googleUser.name,
        email: googleUser.email,
        thumbnail: googleUser.avatarUrl,
      })
      await auth.use('web').login(newUser)
    }

    await auth.use('web').login(user!)
    session.flash('success', 'Connecté avec google')
    return response.redirect().toRoute('home')
  }
}
