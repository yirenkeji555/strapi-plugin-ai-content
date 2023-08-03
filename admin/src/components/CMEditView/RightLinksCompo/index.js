import React, { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';
import getTrad from '../../../utils/getTrad';

import { Box } from '@strapi/design-system/Box';
import { Textarea } from '@strapi/design-system';
import { TextInput } from '@strapi/design-system';
import { Button } from '@strapi/design-system/Button';
import { Select, Option } from '@strapi/design-system';
import { Divider } from '@strapi/design-system/Divider';
import { Typography } from '@strapi/design-system/Typography';
import { NumberInput } from '@strapi/design-system';

import { Grid, GridItem } from '@strapi/design-system';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@strapi/design-system';

import {
  Tabs,
  Tab,
  TabGroup,
  TabPanels,
  TabPanel,
} from '@strapi/design-system';

import Lock from '@strapi/icons/Lock';
import Download from '@strapi/icons/Download';
import Trash from '@strapi/icons/Trash';
import Duplicate from '@strapi/icons/Duplicate';

const settingsAPI = require('../../../api/settings').default;
const completionAPI = require('../../../api/completions').default;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RightLinksCompo = () => {
  const { formatMessage } = useIntl();

  const [isVisible, setIsVisible] = useState(false);

  const [prompt, setPrompt] = useState(undefined);
  const [template, setTemplate] = useState('');
  const [aiType, setAiType] = useState('Claude');
  const [completion, setCompletion] = useState(undefined);
  const [finishReason, setFinishReason] = useState(null);

  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);

  
  const [generateCompletionText, setGenerateCompletionText] = useState(
    formatMessage({
      id: getTrad('Modal.tabs.prompt.generate.button.text.default'),
      defaultMessage: 'Generate',
    })
  );
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    const fetchDefaultSettings = async () => {
      const tmpTemplates = await completionAPI.templates({});
      setTemplates(tmpTemplates);
     }
    fetchDefaultSettings();
  }, []);


  const handlePromptSubmit = () => {
    if (aiType && prompt) {
      setGenerateCompletionText('Generating completion...');
      completionAPI
        .create({ aiType, template, prompt, temperature, maxTokens })
        .then((data) => {
          console.log(data);
          setCompletion(data?.text);
          // setFinishReason(data?.choices[0]?.finish_reason);
          setGenerateCompletionText('Generate');
        });
    }
  };

  const handleCopyToClipboard = () => {
    setIsVisible((prev) => !prev);
    navigator.clipboard.writeText(completion);
  };

  return (
    <Box
      as="aside"
      aria-labelledby="additional-informations"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      paddingBottom={2}
      paddingLeft={2}
      paddingRight={2}
      paddingTop={2}
      shadow="tableShadow"
    >
      <Box>
        <Typography variant="sigma" textColor="neutral600" id="seo">
          {formatMessage({
            id: getTrad('Plugin.name'),
            defaultMessage: 'Open AI Completion',
          })}
        </Typography>
        <Box paddingTop={2} paddingBottom={6}>
          <Divider />
        </Box>
        <Box paddingTop={1}>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {formatMessage({
              id: getTrad('RightLinks.button'),
              defaultMessage: 'Completion',
            })}
          </Button>
          {isVisible && (
            <ModalLayout
              onClose={() => setIsVisible((prev) => !prev)}
              labelledBy="title"
            >
              <ModalHeader>
                <Typography
                  fontWeight="bold"
                  textColor="neutral800"
                  as="h2"
                  id="title"
                >
                  {formatMessage({
                    id: getTrad('Plugin.name'),
                    defaultMessage: 'AI Content',
                  })}
                </Typography>
              </ModalHeader>
              <ModalBody>
                <Box
                  color="neutral800"
                  paddingTop={0}
                  paddingLeft={4}
                  paddingBottom={0}
                  background="neutral0"
                >
                  <Grid
                    gap={{
                      desktop: 5,
                      tablet: 2,
                      mobile: 1,
                    }}
                  >
                    <GridItem padding={1} col={4} s={12}>
                      <Box
                        color="neutral800"
                        paddingTop={1}
                        paddingLeft={4}
                        background="neutral0"
                      >
                        <Select
                          id="select3"
                          label="AI Choose"
                          value={aiType}
                          onChange={setAiType}
                          selectButtonTitle="Carret Down Button"
                        >
                          <Option value="Claude">Claude</Option>
                          <Option value="ChatGpt">ChatGpt</Option>
                          <Option value="gpt-3.5-turbo">gpt-3.5-turbo</Option>
                          <Option value="gpt-4">gpt-4</Option>
                          <Option value="gpt-5">gpt-5</Option>
                          <Option value="bard">bard</Option>
                          <Option value="bing">bing</Option>
                          <Option value="backup1">backup1</Option>
                          <Option value="backup2">backup2</Option>
                          <Option value="backup3">backup3</Option>
                        </Select>
                      </Box>
                    </GridItem>
                    <GridItem padding={1} col={4} s={12}>
                      <Box color="neutral800">
                        <NumberInput
                          label="Temperature"
                          name="content"
                          hint={formatMessage({
                            id: getTrad(
                              'Modal.tabs.settings.temperature.hint.text'
                            ),
                            defaultMessage:
                              'Between 0 and 1 (default). Higher values means the model will take more risks. Try 0,9 for more creative applications, and 0 for ones with a well-defined answer.',
                          })}
                          onValueChange={(value) =>
                            setTemperature(value >= 0 && value <= 1 ? value : 1)
                          }
                          value={temperature}
                        />
                      </Box>
                    </GridItem>
                    <GridItem padding={1} col={4} s={12}>
                      <Box color="neutral800">
                        <NumberInput
                          label="Max tokens"
                          name="content"
                          hint={formatMessage({
                            id: getTrad(
                              'Modal.tabs.settings.maxTokens.hint.text'
                            ),
                            defaultMessage:
                              "The token count of your prompt plus max_tokens cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).",
                          })}
                          onValueChange={(value) =>
                            setMaxTokens(
                              value > 0 && value <= 4096 ? value : 16
                            )
                          }
                          value={maxTokens}
                        />
                      </Box>
                    </GridItem>
                  </Grid>
                </Box>
                <Box
                  color="neutral800"
                  paddingTop={2}
                  paddingLeft={4}
                  background="neutral0"
                >
                  <Select
                    id="select2"
                    label="Templates"
                    hint={template}
                    value={template}
                    onChange={setTemplate}
                    selectButtonTitle="Carret Down Button"
                  >
                    {templates &&
                      templates?.map((tpl) => (
                        <Option value={tpl.prompt}>{tpl.name}</Option>
                      ))}
                  </Select>
                </Box>
                <Box
                  color="neutral800"
                  paddingTop={2}
                  paddingLeft={4}
                  background="neutral0"
                >
                  <Textarea
                    placeholder={formatMessage({
                      id: getTrad('Modal.tabs.prompt.placeholder'),
                      defaultMessage: 'Input your prompt',
                    })}
                    label="Prompt"
                    name="content"
                    onChange={(e) => setPrompt(e.target.value)}
                  >
                    {prompt}
                  </Textarea>
                </Box>
                <Box
                  color="neutral800"
                  paddingTop={3}
                  paddingLeft={4}
                  background="neutral0"
                >
                  <Button
                    disabled={!prompt}
                    paddingTop={2}
                    onClick={() => handlePromptSubmit()}
                  >
                    {generateCompletionText}
                  </Button>
                </Box>
                {completion && (
                  <Box
                    color="neutral800"
                    paddingTop={4}
                    paddingBottom={8}
                    paddingLeft={4}
                    background="neutral0"
                  >
                    <Textarea
                      label="AI Generate Content"
                      style={{ height: '300px' }}
                      rows={10}
                      hint={
                        finishReason && completion
                          ? `${formatMessage({
                              id: getTrad(
                                'Modal.tabs.prompt.finish-reason.text'
                              ),
                              defaultMessage: 'Finish reason:',
                            })} ${finishReason}`
                          : undefined
                      }
                      onChange={(e) => setCompletion(e.target.value)}
                      name="content"
                    >
                      {completion}
                    </Textarea>
                  </Box>
                )}
              </ModalBody>
              <ModalFooter
                startActions={
                  <Button
                    onClick={() => setIsVisible((prev) => !prev)}
                    variant="tertiary"
                  >
                    {formatMessage({
                      id: getTrad('Modal.cancel.button.text'),
                      defaultMessage: 'Cancel',
                    })}
                  </Button>
                }
                endActions={
                  <>
                    {completion && (
                      <Button
                        startIcon={<Trash />}
                        variant="secondary"
                        onClick={() => setCompletion(undefined)}
                      >
                        {formatMessage({
                          id: getTrad('Modal.clear.button.text'),
                          defaultMessage: 'Clear completion',
                        })}
                      </Button>
                    )}

                    {completion && (
                      <Button
                        startIcon={<Duplicate />}
                        onClick={() => handleCopyToClipboard()}
                      >
                        {formatMessage({
                          id: getTrad('Modal.copy-to-clipboard.button.text'),
                          defaultMessage: 'Copy to clipboard',
                        })}
                      </Button>
                    )}
                  </>
                }
              />
            </ModalLayout>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RightLinksCompo;
