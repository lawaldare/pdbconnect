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
`;

const createBuildJob = (serviceName) => `
publish:${serviceName}:
    stage: publish
    needs:
      - pipeline: $PARENT_PIPELINE_ID
        job: build
    script:
      - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
      - docker build --pull --cache-from $CI_REGISTRY_IMAGE --build-arg APP_BASE_HREF=\$${serviceName.toUpperCase()}_BASE_HREF --tag $CI_REGISTRY_IMAGE/connect-${serviceName}:$CI_COMMIT_SHORT_SHA --file apps/${serviceName}/Dockerfile .
      - docker push $CI_REGISTRY_IMAGE/connect-${serviceName}:$CI_COMMIT_SHORT_SHA
    cache:
      key: $CI_PIPELINE_ID
      paths:
        - dist/
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
