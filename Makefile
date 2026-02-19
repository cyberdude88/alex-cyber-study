.PHONY: cat-qa cat-check

cat-qa:
	python3 scripts/validate_cat_bank.py \
		cat/question-bank.sample.json \
		--write-report cat/question-bank.qa.json \
		--write-manifest cat/question-bank.manifest.json

cat-check: cat-qa
	node --check cat/app.js
