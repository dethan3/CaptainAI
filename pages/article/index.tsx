import { observer } from 'mobx-react';
import { InferGetStaticPropsType } from 'next';
import { FC, useContext } from 'react';

import { MDXLayout } from '../../components/Layout/MDXLayout';
import { I18nContext } from '../../models/Translation';
import { ArticleMeta, pageListOf, traverseTree } from '../api/core';

export const getStaticProps = async () => {
  const tree = await Array.fromAsync(pageListOf('/article'));
  const list = tree.map(root => [...traverseTree(root, 'subs')]).flat();

  return { props: { tree, list } };
};

const renderTree = (list: ArticleMeta[]) => (
  <ol className="space-y-2">
    {list.map(({ name, path, meta, subs }) => (
      <li key={name}>
        {path ? (
          <a
            className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium text-primary underline-offset-4 hover:bg-muted hover:underline"
            href={path}
          >
            {name}{' '}
            {meta && (
              <time
                className="text-xs font-normal text-muted-foreground"
                dateTime={meta.updated || meta.date}
              >
                {meta.updated || meta.date}
              </time>
            )}
          </a>
        ) : (
          <details className="rounded-md border bg-card px-3 py-2">
            <summary className="cursor-pointer text-sm font-semibold">
              {name}
            </summary>
            <div className="mt-2 pl-2">{renderTree(subs)}</div>
          </details>
        )}
      </li>
    ))}
  </ol>
);

const ArticleIndexPage: FC<InferGetStaticPropsType<typeof getStaticProps>> =
  observer(({ tree, list: { length } }) => {
    const { t } = useContext(I18nContext);

    return (
      <MDXLayout title={`${t('article')} (${length})`}>
        <div className="mb-6 rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          This page lists local{' '}
          <code className="rounded bg-muted px-1 py-0.5">.md/.mdx</code> files
          under{' '}
          <code className="rounded bg-muted px-1 py-0.5">pages/article</code>.
          Remove or replace those files to customize this section.
        </div>
        {renderTree(tree)}
      </MDXLayout>
    );
  });
export default ArticleIndexPage;
