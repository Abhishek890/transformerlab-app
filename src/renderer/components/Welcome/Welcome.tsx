/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import useSWR from 'swr';

import { Button, Sheet, Stack, Typography } from '@mui/joy';

import labImage from './img/lab.jpg';

import {
  ArrowRightCircleIcon,
  BoxesIcon,
  GraduationCapIcon,
  LayersIcon,
  MessageCircleIcon,
  PlayCircle,
  PlayCircleIcon,
  FlaskConicalIcon,
} from 'lucide-react';
import * as chatAPI from 'renderer/lib/transformerlab-api-sdk';
import { getAPIFullPath } from 'renderer/lib/transformerlab-api-sdk';

import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';

import DownloadFirstModelModal from '../DownloadFirstModelModal';
import HexLogo from '../Shared/HexLogo';
import RecipesModal from '../Experiment/Recipes';
import { useExperimentInfo } from 'renderer/lib/ExperimentInfoContext';

const fetcher = (url) => fetch(url).then((res) => res.json());

function recommendedModel(cpu, os, device) {
  if (!cpu || !os || !device) return '';

  if (cpu == 'arm64' && os == 'Darwin') {
    return 'Llama-3.2-1B-Instruct-4bit (MLX)';
  }

  if (device == 'cuda') {
    return 'Tiny Llama';
  }

  return 'GGUF models';
  // return `${cpu}, ${os}, ${device}`;
}

function typeOfComputer(cpu, os, device) {
  if (!cpu || !os || !device) return '';

  if (cpu == 'arm64' && os == 'Darwin') {
    return 'Apple Silicon Mac';
  }

  return `${cpu} based ${os} computer with ${device} support`;
}

export default function Welcome() {
  // For now disable ModelDownloadModal
  const [modelDownloadModalOpen, setModelDownloadModalOpen] =
    useState<boolean>(false);

  const [recipesModalOpen, setRecipesModalOpen] = useState<boolean>(false);

  const { server, isLoading, isError } = chatAPI.useServerStats();
  const { experimentInfo, setExperimentId } = useExperimentInfo();

  const navigate = useNavigate();

  const cpu = server?.cpu;
  const os = server?.os;
  const device = server?.device;

  // Create experiment creation callback
  const createNewExperiment = async (name: string, fromRecipeId = null) => {
    let newId = 0;

    if (fromRecipeId === null) {
      const response = await fetch(chatAPI.Endpoints.Experiment.Create(name));
      newId = await response.json();
    } else {
      const response = await fetch(
        getAPIFullPath('recipes', ['createExperiment'], {
          id: fromRecipeId,
          experiment_name: name,
        }),
        {
          method: 'POST',
        },
      );
      const responseJson = await response.json();
      if (!(responseJson?.status === 'success')) {
        alert(
          `Error creating experiment from recipe: ${responseJson?.message || 'Unknown error'}`,
        );
        return;
      }
      newId = responseJson?.data?.experiment_id;
    }
    setExperimentId(newId);

    // Navigate to Notes page if experiment was created from a recipe AND recipe is not blank
    if (fromRecipeId !== null && fromRecipeId !== -1) {
      navigate('/experiment/notes');
    }
  };

  return (
    <>
      <DownloadFirstModelModal
        open={modelDownloadModalOpen}
        setOpen={setModelDownloadModalOpen}
        server={server}
      />

      <RecipesModal
        modalOpen={recipesModalOpen}
        setModalOpen={setRecipesModalOpen}
        createNewExperiment={createNewExperiment}
        showRecentExperiments={true}
      />

      <Sheet
        sx={{
          overflow: 'hidden',
          height: 'calc(100% - 1em)',
          backgroundImage: `url("${labImage}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 3,
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--joy-palette-background-surface)',
            opacity: '0.85',
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <Typography
            level="h1"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <HexLogo width={40} height={40} /> Transformer Lab
          </Typography>
          <Typography level="h1" sx={{ fontSize: '48px' }} mb={2}>
            Let's start your next Experiment! 🤓
          </Typography>
          <div>
            <Typography level="body-lg" sx={{ fontSize: '24px' }} mb={2}>
              Get started by downloading a small model from the <BoxesIcon />{' '}
              Model Zoo. <b>{recommendedModel(cpu, os, device)}</b> could be a
              great starting point for your {typeOfComputer(cpu, os, device)}.
              After downloading a model, you can:
            </Typography>
            <Stack
              direction="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <ul>
                <li>
                  <Typography level="body-lg" sx={{ fontSize: '20px' }}>
                    <b>Run it</b> by clicking on <LayersIcon /> Foundation then
                    press <PlayCircleIcon /> Run{' '}
                  </Typography>
                </li>
                <li>
                  <Typography level="body-lg" sx={{ fontSize: '20px' }}>
                    Once a model is running, you can <b>Chat</b> with it by
                    clicking on <MessageCircleIcon /> Interact
                  </Typography>
                </li>
                <li>
                  <Typography level="body-lg" sx={{ fontSize: '20px' }}>
                    <b>Fine tune</b> a model by clicking on{' '}
                    <GraduationCapIcon /> Train
                  </Typography>
                </li>
              </ul>

              {/* Show List Recipes button only if no experiment is selected */}
              {!experimentInfo && (
                <Button
                  endDecorator={<FlaskConicalIcon />}
                  size="lg"
                  color="primary"
                  variant="solid"
                  onClick={() => setRecipesModalOpen(true)}
                  sx={{ mt: 2, fontSize: '18px', px: 3, py: 1.5 }}
                >
                  Browse Recipes & Start New Experiment
                </Button>
              )}

              {/* <Button
              endDecorator={<ArrowRightCircleIcon />}
              size="lg"
              onClick={() => {
                navigate('/experiment/chat');
              }}
            >
              Chat 💬 with it
            </Button> */}
              {/* <Button endDecorator={<ArrowRightCircleIcon />} size="lg">
              Start 🔬 with a pre-built recipe
            </Button> */}
              {/* <Button endDecorator={<ArrowRightCircleIcon />} size="lg">
              Train 🧑🏽‍🎓 a new model from scratch
            </Button> */}
              {/* <Button endDecorator={<ArrowRightCircleIcon />} size="lg">
              Fine tune 🎵 it
            </Button> */}
            </Stack>
            <Typography level="body-lg" mt={2} sx={{ fontSize: '24px' }}>
              Watch our{' '}
              <a href="https://transformerlab.ai/docs/intro" target="_blank">
                Getting Started Video
              </a>
              , or access our{' '}
              <a href="https://transformerlab.ai/docs/intro" target="_blank">
                full documentation
              </a>{' '}
              for more ideas!
            </Typography>
          </div>
        </div>
      </Sheet>
    </>
  );
}
