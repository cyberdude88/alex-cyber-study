.PHONY: cat-annotate cat-contract cat-qa cat-accuracy cat-quality cat-check cat-open-validate cat-build-open conv-init conv-add conv-context

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

cat-open-validate:
	python3 scripts/validate_open_sources.py \
		--bank cat/question-bank.sample.json \
		--catalog sources/open_sources_catalog.json

cat-build-open: cat-open-validate
	python3 scripts/check_cat_contract.py \
		--bank cat/question-bank.sample.json \
		--app cat/app.js \
		--index cat/index.html

conv-init:
	python3 scripts/conversation_pipeline.py init

conv-add:
	python3 scripts/conversation_pipeline.py add \
		--title "$$TITLE" \
		--summary "$$SUMMARY" \
		--decisions "$$DECISIONS" \
		--next "$$NEXT"

conv-context:
	python3 scripts/conversation_pipeline.py context
