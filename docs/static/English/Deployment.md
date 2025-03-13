# Deployment

After you viewed the front UI successfully, you can start to deploy this project.

## GitHub Pages

Init the git repositories, after you commited, push this project to GitHub.

In the GitHub repo page, go to ``Settings -> Pages -> Branch``, change it to the default branch of repo.

After succesfully deployed, you can see the front view of this project in the GitHub Pages page for the repo in the URL ``<Your GitHub name>.github.io`` or ``<Your GitHub name>.github.io/<repository name>``.

## Vercel App

Upload the program to the GitHub for the first.

Click the ``Add New`` in the dashboard of Vercel, select the ``Project``.

In the ``Import Git Repository``, select ``Add GitHub Account``, and select ``Only select repositories``, in the new page, choose the repo for this program.

For the next step, In the ``Build and Output Settings`` of ``Configure Project``, enable the ``Override`` of ``Build Command`` and ``Install Command`` and modify both to ``:`` symbol, click the ``Deploy`` at the bottom.

After deploying finished, click the ``Visit`` button of dashboard to see the front view of this program.

You can change the domain in the ``Domains`` of settings.

## Cloudflare Pages

Upload the program to the GitHub for the first.

In the dashboard of Cloudflare, select the ``Workers & Pages`` at the left, click``Create an application``, select the ``Pages``, click the ``Connect to Git``, click ``Add account``, select ``Only select repositories`` in the new view, choose the repo for this program.

After that, click ``Begin setup``, click ``Save and Deploy``, wait for it to finish.