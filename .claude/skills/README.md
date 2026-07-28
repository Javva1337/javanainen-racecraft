# Projekt-skills

Skill-kedjan som CLAUDE.md kräver för all användarvänd text. Incheckade i repot
så att de alltid finns tillgängliga — även i molnsessioner (Claude Code på webben)
där Rickards lokala `~/.claude/skills` inte följer med.

| Skill | Version | Källa |
| --- | --- | --- |
| `copywriting` | 2.0.1 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) @ `7868cb9` |
| `seo-audit` | 2.0.0 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) @ `7868cb9` |
| `ai-seo` | 2.2.0 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) @ `7868cb9` |
| `copy-editing` | 2.0.0 | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) @ `7868cb9` |
| `humanizer` | 2.9.1 | [blader/humanizer](https://github.com/blader/humanizer) @ `523374d` |

Alla är MIT-licensierade; respektive `LICENSE` ligger i varje skill-katalog.
`evals/`-katalogerna från källrepona är avsiktligt utelämnade (testfixturer,
behövs inte vid körning).

## Uppdatera

```sh
git clone --depth 1 https://github.com/coreyhaines31/marketingskills /tmp/ms
for sk in copywriting seo-audit ai-seo copy-editing; do
  rm -rf .claude/skills/$sk/SKILL.md .claude/skills/$sk/references
  cp /tmp/ms/skills/$sk/SKILL.md .claude/skills/$sk/
  cp -r /tmp/ms/skills/$sk/references .claude/skills/$sk/ 2>/dev/null
done
git clone --depth 1 https://github.com/blader/humanizer /tmp/hz
cp /tmp/hz/SKILL.md .claude/skills/humanizer/
```

Uppdatera versionstabellen ovan efteråt (`VERSIONS.md` i marketingskills-repot).
