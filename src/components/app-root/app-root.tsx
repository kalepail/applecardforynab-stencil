import { Component, h } from '@stencil/core'

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
})
export class AppRoot {

  render() {
    return (
      <main>
        <stencil-router>
          <stencil-route-switch scrollTopOffset={0}>
            <stencil-route url='/' component='app-home' exact={true} />
          </stencil-route-switch>
        </stencil-router>
      </main>
    )
  }
}
