import { ActionIcon, Anchor, Footer } from '@mantine/core';
import { BrandGithub } from 'tabler-icons-react';

import "./AppFooter.scss"

export const AppFooter = () => {
  
  return (
    <Footer height={60} p="xs" className="app-footer">
      <div>
        Created by&nbsp;<Anchor href="https://remybach.dev/" target="_blank">Rémy Bach</Anchor>
      </div>
      <div>
        <ActionIcon radius="xl" size="lg" variant="outline" component="a" href="https://github.com/remybach/dungeons-dice-danger-helper" target="_blank" title="See the code and report issues on Github.">
          <BrandGithub color="black" />
        </ActionIcon>
      </div>
    </Footer>
  );
};
