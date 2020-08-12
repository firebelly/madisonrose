from fabric.api import *
import os

env.hosts = ['staging.mad-rose.com']
env.user = 'madisonrose'
env.remotepath = '/home/madisonrose/apps/madisonrose_staging'
env.git_branch = 'master'
env.warn_only = True

def production():
  env.hosts = ['opal4.opalstack.com']
  env.git_branch = 'master'
  env.remotepath = '/home/madisonrose/apps/madisonrose_production'

def devsetup():
  print "Installing composer, node and bower assets...\n"
  local('composer install')
  local('npm install')
  local('cd assets && bower install')
  local('npx gulp')
  local('cp .env-example .env')
  print "OK DONE! Hello? Are you still awake?\nEdit your .env file with local credentials\nRun `npx gulp watch` to run local gulp to compile & watch assets"

def deploy(composer='y', assets='y'):
  update()
  if composer == 'y':
    composer_install()
  # build and sync production assets
  if assets != 'n':
    local('rm -rf web/assets/dist')
    local('yarn build:production')
    run('mkdir -p ' + env.remotepath + '/web/assets/dist')
    put('web/assets/dist', env.remotepath + '/web/assets/')
  with cd(env.remotepath):
    run('./craft clear-caches/compiled-templates')
    run('./craft invalidate-tags/template')
    run('./craft project-config/apply')

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))

def composer_install():
  with cd(env.remotepath):
    run('~/bin/composer install')
