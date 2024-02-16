import { Build, Component, State, h } from '@stencil/core'
import { handleResponse, getQueryParams } from '../../services/utils'
import {
  has as loHas,
  orderBy as loOrderBy
} from 'lodash-es'
import shajs from 'sha.js'

interface Url {
  code: string,
  id: string,
  email: string,
  state: string,
  pathname: string,
}

@Component({
  tag: 'app-update',
  styleUrl: 'app-update.scss',
})
export class AppUpdate {
  private YNAB_CLIENT_ID: string = 'f266d8d417503401bb5d1a3048d125e0fb3aaadc854e7b7eb0ebff672263637b'
  private YNAB_REDIRECT_URI: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3333/update' : 'https://applecardforynab.com/update'
  private baseUrl: string = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://applecardforynab.tyler.workers.dev'
  private url: Url

  @State() accountId: string
  @State() accounts: Array<any> = []
  @State() complete: boolean = false
  @State() error: boolean = false

  async componentWillLoad() {
    this.url = getQueryParams(location.search)

    if (
      loHas(this.url, 'code')
      && loHas(this.url, 'state')
    ) {
      const [ , id, email ] = this.url.state.split(':')
      this.url.id = id
      this.url.email = email
      this.url.pathname = '/update'

      await fetch(`${this.baseUrl}/access`, {
        method: 'POST',
        body: JSON.stringify(this.url),
      })
        .then(handleResponse)
        .then((data) => {
          const accounts = loOrderBy(data, 'name', 'asc')
          this.accounts = accounts
          this.accountId = accounts[0].id
        })
        .catch(() => this.error = true)
    }

    else if (
      loHas(this.url, 'id') 
      && loHas(this.url, 'email')
    ) this.url = { ...this.url, state: `${Date.now()}:${this.url.id}:${this.url.email}` }

    // history.replaceState(null, null, window.location.pathname)
  }

  next(e) {
    e.preventDefault()

    const email = (e.target.email.value.match(/(?<=\<).*(?=\>)/gi)?.[0] || e.target.email.value).toLowerCase()
    const id = shajs('sha256').update(email).digest('hex')

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    params.append('id', id);
    params.append('email', email);

    url.search = params.toString();
    window.location.href = url.toString();
  }
  update(e) {
    this.accountId = e.target.value
  }
  refresh() {
    fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      body: JSON.stringify(this.url),
    })
      .then(handleResponse)
      .then((data) => {
        const accounts = loOrderBy(data, 'name', 'asc')
        this.accounts = accounts
        this.accountId = accounts[0].id
      })
      .catch(() => this.error = true)
  }
  save() {
    fetch(`${this.baseUrl}/update`, {
      method: 'POST',
      body: JSON.stringify({
        id: this.url.id,
        email: this.url.email,
        account_id: this.accountId
      }),
    })
      .then(() => this.complete = true)
      .catch(() => this.error = true)
  }

  render() {
    return (
      Build.isBrowser
        ? this.url
          ? (
            this.url.state
              && !this.url.code
              ? <div class="welcome">
                <h1>Apple Card for YNAB</h1>
                <a href={`https://app.youneedabudget.com/oauth/authorize?client_id=${this.YNAB_CLIENT_ID}&redirect_uri=${this.YNAB_REDIRECT_URI}&response_type=code&state=${this.url.state}`}>Connect your YNAB account</a>
                <a href="https://applecardforynab.com/assets/docs/privacy.md">Privacy policy</a>
              </div>

              : [
                <h1>Connected</h1>,
                this.error
                  ? <p>❌</p>
                  : this.complete
                    ? <p>✅</p>
                    : [
                      <p>Select the YNAB account Apple Card transactions should be imported to.</p>,
                      this.accounts.length
                        ? <div class="actions">
                          <select onInput={(e) => this.update(e)}>
                            {this.accounts.map((account) =>
                              <option
                                value={account.id}
                                selected={this.accountId === account.id}
                              >{account.name}</option>
                            )}
                          </select>
                          <button onClick={() => this.refresh()}>Refresh</button>
                          <button onClick={() => this.save()}>Save</button>
                        </div>
                        : null,
                      <aside>If you don't have one yet <a href="https://app.youneedabudget.com" target="_blank">go make one</a> then come back and click Refresh.</aside>,
                    ]
              ]
          )
          : [
            <h1>Step 1: Enter your email</h1>,
            <form onSubmit={this.next}>
              <label>
                Enter the email address you send Apple Card statements from
                <div>
                  <input type="email" name="email" placeholder='Email address' value={process.env.NODE_ENV === 'development' ? 'hi@tyvdh.com' : ''} />
                  <button type='submit'>Next</button>
                </div>
              </label>
            </form>
          ]
        : null
    )
  }
}
