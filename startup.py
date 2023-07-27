#!/usr/bin/env python3

import iterm2

async def main(connection):
    app = await iterm2.async_get_app(connection)
    window = app.current_terminal_window

    await window.current_tab.current_session.async_send_text('cd ~/Desktop/code/crumble/\nnpm run dev\n')

    tab = await window.async_create_tab()

    await window.current_tab.current_session.async_send_text('cd ~/Desktop/code/crumble/\nnpx prisma studio\n')

    tab = await window.async_create_tab()

    await window.current_tab.current_session.async_send_text('cd ~/Desktop/code/crumble/\n')

iterm2.run_until_complete(main)