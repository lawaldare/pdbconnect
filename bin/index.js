const { writeFileSync } = require('fs');

const createBaseFile = () => `
stages:
    - publish
    - deploy
`;

const createEmptyJob = () => `
publish:empty:
    stage: publish
    script:
        - echo "No jobs affected by this commit"
    rules:
        - if: $PARENT_PIPELINE_ID
`;

const createBuildJob = (serviceName) => `
publish:${serviceName}:
    stage: publish
    needs:
      - pipeline: $PARENT_PIPELINE_ID
        job: build
    variables:
      DOCKER_CONFIG: '/tmp/docker-config-$CI_JOB_ID'
    script:
      - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
      - docker build --pull --cache-from $CI_REGISTRY_IMAGE --tag $CI_REGISTRY_IMAGE/connect-${serviceName}:$CI_COMMIT_SHORT_SHA --file apps/${serviceName}/Dockerfile .
      - docker push $CI_REGISTRY_IMAGE/connect-${serviceName}:$CI_COMMIT_SHORT_SHA
    rules:
      - if: $PARENT_PIPELINE_ID
    tags:
      - pdbe-shell
`;

const createDeployTrigger = (serviceName) => `
trigger_deploy:${serviceName}:
    stage: deploy
    inherit:
      variables: false
    variables:
      UPSTREAM_REF: $CI_COMMIT_REF_NAME
      IMAGE_PATHS: $CI_REGISTRY_IMAGE/connect-${serviceName}:$CI_COMMIT_SHORT_SHA
      IMAGE_NAMES: connect-${serviceName}
      APP_NAME: connect-${serviceName}
    trigger:
      project: pdbe/backend/k8s-deploy-configs
      branch: main
      strategy: depend
    needs:
      - publish:${serviceName}
    rules:
      - if: $PARENT_PIPELINE_ID
`;

const createCIFile = (projects) => {
  if (!projects.length) {
    return createBaseFile().concat(createEmptyJob());
  }

  return createBaseFile().concat(projects.map(createBuildJob).join('\n')).concat(projects.map(createDeployTrigger).join('\n'));
};

const createDynamicGitLabFile = () => {
  const [stringifiedAffected] = process.argv.slice(2);

  const projects = JSON.parse(stringifiedAffected);

  const content = createCIFile(projects);

  writeFileSync('dynamic-gitlab-ci.yml', content);
};

createDynamicGitLabFile();
