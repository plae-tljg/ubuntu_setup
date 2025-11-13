# Github Pages

## Conflicting Endpoints

There is an interesting problem, a github user can serve github pages per repository. Like I have a repository [ubuntu_setup](https://github.com/plae-tljg/ubuntu_setup), I can access its github page by [https://plae-tljg.github.io/ubuntu_setup/](https://plae-tljg.github.io/ubuntu_setup/).  

But a github user can also have personal page by creating personal repository, liek for me `plae-tljg`, I can make a repository called `plae-tljg.github.io`, which its deployed page can be access with [plae-tljg.github.io](plae-tljg.github.io). We can call it a `personal repo`.  

Now what if you create an endpoint under your personal repo of same name as your other repository which has deployed pages, like `ubuntu_setup`?  

Let's experiment.  

### Localhost Appearance

I created the experiment at `d1c20f6f3eeab0f9cd167f21155015d87e1c7e2e` commit of my personal repo.  

`npm run dev` at localhost show following pages, which actually has different pages on endpoint with slash ([http://localhost:5173/ubuntu_setup](http://localhost:5173/ubuntu_setup)) and without slash ([http://localhost:5173/ubuntu_setup/](http://localhost:5173/ubuntu_setup/)).  

![Personal Repository - localhost - Home](/assets/github_pages/personal_localhost_home.png)  

![Personal Repository - localhost - Without Slash](/assets/github_pages/ubuntu_localhost_without_slash.png)  

![Personal Repository - localhost - With Slash](/assets/github_pages/ubuntu_localhost_with_slash.png)  

### Github Page Deployment

Now using the script to deploy to github page, we can see following:  

![Personal Repository - Github Page - Home](/assets/github_pages/personal_gh_pages_home.png)  

![Personal Repository - Github Page - Without Slash](/assets/github_pages/ubuntu_gh_pages_without_slash.png)  

Note that the page of without slash [https://plae-tljg.github.io/ubuntu_setup](https://plae-tljg.github.io/ubuntu_setup) cannot be visited unless you click button from homepage of personal repo github page. If dont do that, you will be redirected to [https://plae-tljg.github.io/ubuntu_setup/](https://plae-tljg.github.io/ubuntu_setup/), which is just following:  


![Personal Repository - Github Page - With Slash](/assets/github_pages/ubuntu_gh_pages_with_slash.png)  

so you can see that teh page of [https://plae-tljg.github.io/ubuntu_setup/](https://plae-tljg.github.io/ubuntu_setup/) is actually the github page for the other repository `ubuntu_setup`.  

