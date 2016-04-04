#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script constructs HTML file based on template.html, template_question.html, template_category.html
and questions from questions.py.
"""


from __future__ import unicode_literals
import sys
import os
import codecs
import logging
from argparse import ArgumentParser


def exit_with_message(msg):
    logging.fatal(msg)
    sys.exit(msg)


try:
    from questions import questions
except (SyntaxError, ImportError) as e:
    logging.debug(e)
    exit_with_message("questions.py seems to be not valid Python file because of syntax error or is not found.")


def read_file(name):
    try:
        with codecs.open(name, 'r', 'utf-8') as f:
            return f.read()
    except IOError as e:
        logging.debug(e)
        exit_with_message("failed to read file '{}'.".format(name))


def render_by_context(template, context):
    for k, v in context.iteritems():
        template = template.replace('{{{{{0}}}}}'.format(k), unicode(v))
    return template

def generate_html(args):
    cat_str = read_file('template_category.html')
    cat_html = ''
    quest_str = read_file('template_question.html')
    quest_html = ''

    prices_const = (100, 200, 400, 600, 800)

    for i, category in enumerate(questions, 0):
        context = {'CATEGORY': category[0], 'CATEGORY_INDEX': i + 1}
        cat_html += render_by_context(cat_str, context) + '\n'

        for j, (q, v, r) in enumerate(category[1], 0):
            quest_price = prices_const[j]
            context['QUESTION_PRICE'] = quest_price
            context['QUESTION'] = q

            for k, a in enumerate(v, 0):
                is_right = (k == r)
                q_index = k + 1
                context['ANSWER_TEXT_{}'.format(q_index)] = a
                context['ANSWER_VALUE_{}'.format(q_index)] = quest_price if is_right else 0
                # default npn-ascii values for arg-parser looks like great pain
                context['ANSWER_MESSAGE_{}'.format(q_index)] = args.right_answer or 'Верно!' if is_right else args.wrong_answer or 'Неправильно'

            quest_html += render_by_context(quest_str, context) + '\n'

    index_str = read_file('template_index.html')
    return render_by_context(index_str, {'CATEGORIES_BLOCK': cat_html, 'QUESTIONS_BLOCK': quest_html})

def main(args):
    logging.basicConfig(level=args.loglevel,
                        format=u'%(asctime)s %(message)s')
    logging.debug('starting with params: {}'.format(args))

    html = generate_html(args)
    with codecs.open(args.outfile, 'w', 'utf-8') as out:
        out.write(html)

    logging.critical('{} successfully was rendered.'.format(args.outfile))


def commandline_arg(bytestring):
    unicode_string = bytestring.decode(sys.getfilesystemencoding())
    return unicode_string


if __name__ == '__main__':
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('-v', '--verbose', dest='loglevel', action='store_const',
                        const=logging.DEBUG, default=logging.WARN, help='verbose (debug) output')
    parser.add_argument('--right', dest='right_answer', type=commandline_arg,
                        help='right answer message. default: Неправильно')
    parser.add_argument('--wrong', dest='wrong_answer', type=commandline_arg,
                        help='wrong answer message. default: Верно!')
    parser.add_argument('outfile', nargs='?', default=os.path.join('static', 'out.html'), help='output filename. default "static/out.html"')
    args = parser.parse_args()
    main(args)


