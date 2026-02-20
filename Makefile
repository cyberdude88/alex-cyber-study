.PHONY: cat-contract cat-qa cat-check

cat-contract:
	python3 scripts/check_cat_contract.py

cat-qa: cat-contract
	python3 scripts/validate_cat_bank.py \
		cat/question-bank.sample.json \
		--write-report cat/question-bank.qa.json \
		--write-manifest cat/question-bank.manifest.json

cat-check: cat-qa
	node --check cat/app.js
