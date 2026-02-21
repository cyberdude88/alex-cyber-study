.PHONY: cat-annotate cat-contract cat-qa cat-accuracy cat-quality cat-check

cat-annotate:
	python3 scripts/annotate_cat_sources.py cat/question-bank.sample.json

cat-contract: cat-annotate
	python3 scripts/check_cat_contract.py

cat-qa: cat-contract
	python3 scripts/validate_cat_bank.py \
		cat/question-bank.sample.json \
		--write-report cat/question-bank.qa.json \
		--write-manifest cat/question-bank.manifest.json

cat-accuracy:
	python3 scripts/audit_cat_accuracy.py \
		cat/question-bank.sample.json \
		--write-report cat/question-bank.accuracy.json

cat-quality:
	python3 scripts/item_quality_lint.py \
		cat/question-bank.sample.json \
		--write-report cat/question-bank.quality.json \
		--profile human

cat-check: cat-qa cat-accuracy cat-quality
	node --check cat/app.js
