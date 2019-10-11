from flask import render_template, flash, redirect, url_for
from app import app
from app.forms import GenerationSpec, GetHint, GenerateMore, ShowAnswer
from app import DEFAULT_DATA, TOTAL_RULE_COUNT
from script import *
import random
import logging
from app.forms import TYPE_SELECTION_DICT, HINT_SELECTION_DICT, MORE_GEN_SELECTION_DICT

RETRY_LIMIT = 50
gen: Generator
data: dict
size: int
rule_type: str
LOGGER = logging.getLogger("app.logger")
show_phone_interest = False
show_full_phonemes = False


@app.route('/index', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'])
def index():
    global data, size, rule_type, show_phone_interest, show_full_phonemes

    gen_spec_form = GenerationSpec()
    hint_form = GetHint()
    generate_more_form = GenerateMore()
    answer_form = ShowAnswer()

    if gen_spec_form.submit.data and gen_spec_form.validate_on_submit():
        type_selection = gen_spec_form.type_selection.data
        LOGGER.debug("Type Selection: %s", str(type_selection))
        rule_selection_data = gen_spec_form.rule_selection.data
        is_selected = rule_selection_data is not None
        LOGGER.debug("Manual Selection: %s", str(is_selected))

        if is_selected:
            rule_selection = DEFAULT_DATA['rules'][int(rule_selection_data)]  # type: Rule
        else:
            rule_selection = DEFAULT_DATA['rules'][random.randint(0, TOTAL_RULE_COUNT - 1)]  # type: Rule

        classification_match_retry = 0
        while True:
            if classification_match_retry > RETRY_LIMIT:
                LOGGER.error("Can not seem to get matched phoneme & rule to conform classification")
                return redirect(url_for('index'))

            phonemes = get_random_phonemes(rule_selection.get_a_matcher(None, None, DEFAULT_DATA['f2ss']))
            type_ = rule_selection.get_rule_type(phonemes, DEFAULT_DATA['f2t'], DEFAULT_DATA['f2ss'])

            if TYPE_SELECTION_DICT[type_selection] is not None and TYPE_SELECTION_DICT[type_selection] != type_:
                classification_match_retry += 1

                if not is_selected:
                    rule_selection = DEFAULT_DATA['rules'][random.randint(0, TOTAL_RULE_COUNT - 1)]

                continue

            break

        rule_type = str(type_)
        size = int(gen_spec_form.question_size.data)

        is_shuffled = bool(gen_spec_form.randomize_order.data)
        LOGGER.debug("Shuffle Result: %s", str(is_shuffled))
        data = _get_valid_data(rule_selection, phonemes, size, is_shuffled)

        if data is None:
            return redirect(url_for('index'))
        else:
            return render_template('index.html', title='Result', gen_form=gen_spec_form, hint_form=hint_form,
                                   gen_more_form=generate_more_form, answer_form=answer_form, data=data, size=size,
                                   rule_type=rule_type)

    if hint_form.submit_hint.data and hint_form.validate_on_submit() and 'data' in globals():
        hint_selection = hint_form.hints.data

        if HINT_SELECTION_DICT[hint_selection] == "poi":
            show_phone_interest = True

        if HINT_SELECTION_DICT[hint_selection] == "fp":
            show_full_phonemes = True

        return render_template('index.html', title='Result', gen_form=gen_spec_form, hint_form=hint_form,
                               gen_more_form=generate_more_form, answer_form=answer_form, data=data, size=size,
                               rule_type=rule_type, show_full_phonemes=show_full_phonemes,
                               show_phone_interest=show_phone_interest)

    if generate_more_form.submit_request.data and generate_more_form.validate_on_submit() and 'data' in globals() \
            and 'gen' in globals():
        generate_selection = generate_more_form.requested_type.data
        more_data = None

        if MORE_GEN_SELECTION_DICT[generate_selection] == "CADT":
            more_data = gen.generate([5, 0, 0, 0, 0], False, False, DEFAULT_DATA['f2t'], DEFAULT_DATA['f2ss'],
                                     DEFAULT_DATA['gloss_grp'])

        if MORE_GEN_SELECTION_DICT[generate_selection] == "CAND":
            more_data = gen.generate([0, 0, 5, 0, 0], False, False, DEFAULT_DATA['f2t'], DEFAULT_DATA['f2ss'],
                                     DEFAULT_DATA['gloss_grp'])

        if MORE_GEN_SELECTION_DICT[generate_selection] == "NCAD":
            more_data = gen.generate([0, 0, 0, 5, 0], False, False, DEFAULT_DATA['f2t'], DEFAULT_DATA['f2ss'],
                                     DEFAULT_DATA['gloss_grp'])

        if more_data is not None:
            data['UR'].extend(more_data['UR'])
            data['SR'].extend(more_data['SR'])
            data['Gloss'].extend(more_data['Gloss'])
            size += len(more_data['UR'])

        return render_template('index.html', title='Result', gen_form=gen_spec_form, hint_form=hint_form,
                               gen_more_form=generate_more_form, answer_form=answer_form, data=data, size=size,
                               rule_type=rule_type, show_full_phonemes=show_full_phonemes,
                               show_phone_interest=show_phone_interest)

    if answer_form.show_answer.data and answer_form.validate_on_submit() and 'data' in globals():
        return render_template('index.html', title='Result', gen_form=gen_spec_form, hint_form=hint_form,
                               gen_more_form=generate_more_form, answer_form=answer_form, data=data, size=size,
                               rule_type=rule_type, show_full_phonemes=True, show_phone_interest=True, show_answer=True)

    return render_template('index.html', title='Demo', gen_form=gen_spec_form, hint_form=hint_form,
                           gen_more_form=generate_more_form, answer_form=answer_form)


def _get_valid_data(rule_selected: Rule, phonemes: list, size_: int, is_shuffled: bool):
    global gen
    data_ = None

    try:
        gen = Generator(phonemes, DEFAULT_DATA['templates'], rule_selected, 5,
                        DEFAULT_DATA['f2t'], DEFAULT_DATA['f2ss'])
        data_ = gen.generate(size_, True, is_shuffled, DEFAULT_DATA['f2t'],
                             DEFAULT_DATA['f2ss'],
                             DEFAULT_DATA['gloss_grp'])
        data_['generator'] = gen
    except GenerationNoCADTError or GeneratorParameterError or GeneratorError:
        LOGGER.exception('')
    except Exception as err:
        LOGGER.exception("UNEXPECTED ERROR")
        raise err

    if data_ is not None:
        LOGGER.info("Data recorded: \nUR %s\nSR %s\n%s\n" % (
            [str(s) for s in data_['UR']], [str(s) for s in data_['SR']], gen.get_log_stamp()))
    else:
        LOGGER.debug("No data recorded (None).")

    return data_
